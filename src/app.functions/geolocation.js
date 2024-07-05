const hubspot = require("@hubspot/api-client");
const { HS_ACCESS_TOKEN, IP_GEO_API_KEY } = process.env;

exports.main = (context, sendResponse) => {

  // Extract the form data from the request
  const { firstName, lastName, email } = context.body;
  //console.log("firstName, lastName, email: ", firstName, lastName, email);

  // Get geolocation data for the IP address
  const fetchIPGeolocation = async (ip) => {
    console.log(`Fetching IP data for IP "${ip}" from email "${email}"...`);
    try {
      const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${IP_GEO_API_KEY}&ip=${ip}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      //console.log('IP Geolocation Data:', data);
      return data;
    } catch (e) {
      handleError(e, "There was a problem fetching IP data. Please try again.");
    }
  };

  // Upload the form data to HubSpot
  const uploadToHubSpot = async (ipData) => {
    console.log(`Uploading data to HubSpot for email "${email}"...`);
    // Extract the IP data we need (county, city, state)
    const { country_name, city, state_prov } = ipData;
    //console.log("country_name, city, state_prov: ", country_name, city, state_prov);
    
    try {
      // Create a new HubSpot client
      const hubspotClient = new hubspot.Client({ accessToken: HS_ACCESS_TOKEN });
      // Build the contact object for HubSpot
      const contactObj = {
        properties: {
          firstname: firstName,
          lastname: lastName,
          email: email,
          country: country_name,
          city: city,
          state: state_prov
        }
      };

      const contactExists = await checkIfContactExists(email, hubspotClient);
      if (contactExists) {
        console.log(`Contact already exists for "${email}". Updating...`);
        // Update the contact
        await hubspotClient.apiRequest({
          method: 'Patch',
          path: `/crm/v3/objects/contacts/${email}?idProperty=email`,
          body: contactObj
        });
      } else {
        console.log(`Contact does not exist for "${email}". Creating...`);
        // Create the contact
        await hubspotClient.crm.contacts.basicApi.create(contactObj);
      }
    } catch (e) {
      handleError(e, "There was a problem uploading the data to Hubspot. Please try again.");
    }
  }

  // Check if the contact already exists in HubSpot (return boolean)
  const checkIfContactExists = async (email, hubspotClient) => {
    try {
      const response = await hubspotClient.apiRequest({
        path: `/crm/v3/objects/contacts/${email}?idProperty=email`,
      });
      return response.body ? true : false;
    } catch (e) {
      if (e.statusCode === 404) {
        // Contact not found error
        return false;
      } else {
        // All other errors
        handleError(e, "There was a problem checking if the contact exists in Hubspot. Please try again.");
      }
    }
  }

  // Function that handles errors and sends a response to the client
  const handleError = (e, customMessage = "There was a problem processing the form. Please try again.") => {
    console.error('Error:', e.statusCode, e.message, customMessage);
    sendResponse({
      statusCode: e.statusCode ? e.statusCode : 500,
      body: {
        message: customMessage,
        error: e.message
      }
    });
  };

  // main function that hydrates the incoming form data with IP geolocation and uploads it to HubSpot
  (async () => {
    console.log(`Processing form data for email "${email}"...`);
    try {
      const ipData = await fetchIPGeolocation(context.headers["true-client-ip"]);
      await uploadToHubSpot(ipData);
      sendResponse({
        body: ipData,
        statusCode: 200
      });
    } catch (e) {
      handleError(e, "There was a problem processing the form. Please try again.");
    }
  })();
};

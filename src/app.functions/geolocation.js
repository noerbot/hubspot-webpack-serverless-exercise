const { HS_ACCESS_TOKEN, IP_GEO_API_KEY } = process.env;

exports.main = (context, sendResponse) => {

  console.log("context.params", context.params);

  const fetchIPGeolocation = async (ip) => {
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
      console.log('IP Geolocation Data:', data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      sendResponse({
        statusCode: 500,
        body: { message: error.message }
      });
    }
  };

  const uploadToHubSpot = async (data) => {
    console.log("TODO: Implement uploadToHubSpot function");
    console.log("Data to upload: ", data);
    console.log("context.body: ", context.body);
  }

  // main function that hydrates the incoming form data with IP geolocation and uploads it to HubSpot
  (async () => {
    try {
      const ipData = await fetchIPGeolocation(context.headers["true-client-ip"]);
      await uploadToHubSpot(ipData);
      sendResponse({
        body: ipData,
        statusCode: 200
      });
    } catch (e) {
      sendResponse({
        statusCode: 500,
        body: {
          message: "There was a problem processing the form. Please try again.",
          error: e.message
        }
      });
    }
  })();
};

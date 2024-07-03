exports.main = ({ params }, sendResponse) => {
  const { name } = params;
  const humanReadableTime = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '');
  sendResponse({
    body: {
      greeting: `Hello, ${name || "World"}!`,
      humanReadableTime,
    },
    statusCode: 200,
  });
};

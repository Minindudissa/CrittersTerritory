const brevo = require("@getbrevo/brevo");
const MY_BREVO_API_KEY = process.env.BREVO_API_KEY;

const Email = async (req, res) => {
  const { toName, toEmail, subject, emailContent, replyToEmail, replyToName } =
    req.body;

  try {
    console.log("Brevo API Key:", process.env.BREVO_API_KEY);

    let defaultClient = brevo.ApiClient.instance;

    let apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = MY_BREVO_API_KEY;

    let apiInstance = new brevo.TransactionalEmailsApi();
    let sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = emailContent;
    sendSmtpEmail.sender = {
      name: "Critters Territory",
      email: "crittersterritory@gmail.com",
    };
    sendSmtpEmail.to = [{ email: toEmail, name: toName }];
    sendSmtpEmail.replyTo = { email: replyToEmail, name: replyToName };
    sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
    sendSmtpEmail.params = {
      parameter: "My param value",
      subject: "common subject",
    };

    apiInstance.sendTransacEmail(sendSmtpEmail).then(
      function (data) {
        return res.status(201).json({
          success: true,
          message: "success",
          responseData: data,
        });
      },
      function (error) {
        console.error("Error:", error.message);
        return res.status(500).json({
          success: false,
          message: "An unexpected error occurred. Please try again later No.",
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

module.exports = { Email };

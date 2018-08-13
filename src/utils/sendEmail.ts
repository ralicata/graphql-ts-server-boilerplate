import * as SparkPost from 'sparkpost';
const options = {
  origin: 'https://api.eu.sparkpost.com:443'
};

const client = new SparkPost(process.env.SPARKPOST_API_KEY, options);

export const sendEmail = async (recipient: string, url: string) => {
  const response = client.transmissions.send({
    options: {
      sandbox: true
    },
    content: {
      from: 'testing@sparkpostbox.com',
      subject: 'Confirm your email',
      html: `<html>
          <body>
            <p>Testing SparkPost - the world's most awesomest email service!</p>
            <a href="${url}">click me</a>
          </body>
        </html>`
    },
    recipients: [{ address: recipient }]
  });

  console.log(response);
};

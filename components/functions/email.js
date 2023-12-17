import RNSmtpMailer from "react-native-smtp-mailer";

export function sendVerficationEmail(profile, code) {
    const username = 'foodapphelpcustomer@gmail.com'
    const password = "louajmoowfxcdmgn"
    const from = 'VanCon Captain'
    const heading = `Hi ${profile.name} Welcome To ${from}!`
    const to = profile.email
    const subject = 'Verification'
    const light = 'Explore a world of delicious flavors and culinary experiences. Our VanCon Captain brings you a wide range of mouthwatering dishes, recipes, and dining recommendations. Whether you are a foodie searching for new recipes to try at home, a traveler looking for the best local cuisines, or simply seeking inspiration for your next meal, we have got you covered. Discover the finest restaurants, street food vendors, and hidden gems in your area. Browse through our extensive collection of recipes from different cultures and cooking styles. Get ready to embark on a delightful gastronomic journey with our VanCon Captain! Start exploring now and satisfy your cravings with our curated selection of culinary delights.'
    const main = `Your Verification Code: ${code}`

    const mail = RNSmtpMailer.sendMail({
        mailhost: "smtp.gmail.com",
        port: "465",
        ssl: true, // optional. if false, then TLS is enabled. Its true by default in android. In iOS TLS/SSL is determined automatically, and this field doesn't affect anything
        username: username,
        password: password,
        fromName: from,
        recipients: to,
        subject: subject,
        htmlBody: `<p><span style="font-size: 20px; font-weight: 500">${heading}</span></p><h1>${main}</h1>`,

    })
    return mail
}


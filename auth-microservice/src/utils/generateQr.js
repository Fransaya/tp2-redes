import speakeasy from "speakeasy";
import qrcode from "qrcode";
import qrcodeTerminal from "qrcode-terminal";

export const generateQr = async (email, appName) => {
  const secret = speakeasy.generateSecret({ length: 20 });
  const otpauthUrl = speakeasy.otpauthURL({
    secret: secret.base32,
    label: `app:${email}`,
    issuer: appName,
    encoding: "base32",
  });
  console.log("otpauthUrl: ", otpauthUrl);

  qrcodeTerminal.generate(otpauthUrl, { small: true }, function (qrcode) {
    console.log("QR");
    console.log(qrcode);
  });

  try {
    const data_url = await new Promise((resolve, reject) => {
      qrcode.toDataURL(otpauthUrl, (err, data_url) => {
        if (err) reject(err);
        else resolve(data_url);
      });
    });

    const infoGenerate = { secret: secret.base32, qrcode: data_url };
    console.log("infoGenerate: ", infoGenerate);
    return infoGenerate;
  } catch (error) {
    console.error("Error generando QR:", error);
    throw error;
  }
};

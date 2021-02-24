require("dotenv").config();

const {
  config,
  Credentials,
  CognitoIdentityServiceProvider,
} = require("aws-sdk");

const userPoolId = process.env.USER_POOL_ID;
const credentials = new Credentials({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});
config.update({
  credentials,
  region: "ap-northeast-1",
});
const client = new CognitoIdentityServiceProvider();

// 実際は email 以外に必要な属性も引数とする
async function createUser(email) {
  const params = {
    // ForceAliasCreation: boolean,
    MessageAction: "SUPPRESS",
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "email_verified",
        Value: "true",
      },
      {
        Name: "given_name",
        Value: "dummy",
      },
      {
        Name: "family_name",
        Value: "dummy",
      },
    ],
    Username: email,
    UserPoolId: userPoolId,
  };
  return await client.adminCreateUser(params).promise();
}

async function setPassword(username, password) {
  const params = {
    Password: password,
    Permanent: true,
    Username: username,
    UserPoolId: userPoolId,
  };
  return await client.adminSetUserPassword(params).promise();
}

(async () => {
  // 実際はここで、外部 (ファイルなど) からメールアドレスとパスワードのペアを取得する
  const email = "user@example.com";
  const password = "password";

  // ユーザー作成、この時点では UserStatus は'FORCE_CHANGE_PASSWORD'
  const user = await createUser(email);
  console.log(user);

  // ユーザーのパスワードをセット、これにより UserStatus も更新される
  const { Username: username } = user.User;
  const res = await setPassword(username, password);
  console.log(res); // 成功すると空の Body が返る

  // UserStatus が 'CONFIRMED' となっていることを確認、実際は不要
  console.log(
    await client
      .adminGetUser({
        Username: username,
        UserPoolId: process.env.USER_POOL_ID,
      })
      .promise()
  );
})();

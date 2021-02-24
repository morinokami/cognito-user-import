# cognito-user-import

Admin 権限により、メールアドレスとパスワードから Cognito ユーザーをインポートするデモ (ここでは 1 ユーザーのみ登録する)。

実行する際は、以下のような `.env` ファイルをプロジェクトのルートに作成すること:

```
ACCESS_KEY_ID=<アクセスキーID>
SECRET_ACCESS_KEY=<シークレットアクセスキー>
USER_POOL_ID=<ユーザープールID>
```

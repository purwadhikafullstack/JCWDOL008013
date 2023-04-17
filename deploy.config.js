module.exports = {
  apps: [
    {
      name: "JCWDOL00803", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 8803,
      },
      time: true,
    },
  ],
};

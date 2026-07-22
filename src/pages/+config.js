import vikeReact from "vike-react/config";

export default {
  extends: vikeReact,
  title: "SkyUp – Custom Printing",
  hooksTimeout: {
    data: {
      warning: 8000,   // 8 seconds
      error: 60000,    // 60 seconds — enough for a Render cold start
    },
  },
};
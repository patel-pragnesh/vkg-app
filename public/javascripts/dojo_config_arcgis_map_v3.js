var dojoConfig = { 
    parseOnLoad: true,
    paths: {
      //if you want to host on your own server, download and put in folders then use path like: 
    },
    packages: [
    {
        name: "modules",
        // location: location.pathname.replace(/\/[^/]+$/, "") + "/modules"
        location: "/javascripts/modules"
    } 
    ]
};
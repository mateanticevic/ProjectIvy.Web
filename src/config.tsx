interface ApiElement {
    url: string;
}

interface ConfigRoot {
    api: ApiElement;
}

export const config: ConfigRoot = {
    api: {
        url: 'http://api2.anticevic.net/',
        // url: "http://localhost:4680/"
    },
};

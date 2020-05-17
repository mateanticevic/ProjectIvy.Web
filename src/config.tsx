interface ApiElement {
    url: string;
}

interface ConfigRoot {
    api: ApiElement;
}

export const config: ConfigRoot = {
    api: {
        url: 'https://api2.anticevic.net/',
        //url: "http://localhost:5000/"
    },
};

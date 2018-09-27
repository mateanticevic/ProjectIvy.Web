type ApiElement = {
    url: string
};

type ConfigRoot = {
    api: ApiElement
};

export const config: ConfigRoot = {
    api: {
        url: "https://api2.anticevic.net/"
        //url: "http://localhost:4680/"
    }
};
export class Broker {
    public readonly host: string;
    public readonly port: number;

    constructor(host: string, port: number) {
        this.host = host;
        this.port = port;
    }

    public get url(): string {
        return 'mqtt://' + this.host + ':' + this.port;
    }
}

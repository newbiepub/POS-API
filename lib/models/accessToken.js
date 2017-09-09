const ttl = () =>{
    let today = new Date();
    let nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+14);
    return nextWeek.getTime();
}

class AccessToken {
    constructor(props) {
        this.access_token = props.access_token;
        this.refresh_token = props.refresh_token;
        this.ttl = ttl();
        this.companyId = props.companyId
    }
}

export default AccessToken;
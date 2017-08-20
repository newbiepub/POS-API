const ttl = () =>{
    var today = new Date();
    var nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+14);
    return nextweek.getTime();
}

class AccessToken {
    constructor(props) {
        this.access_token = props.access_token;
        this.ttl = ttl();
        this.companyId = props.companyId
    }
}

export default AccessToken;
const Unauthorized = () => {
    return (
        <div style={{display:'flex', alignItems:'center', flexDirection:'column'}}>
            <h1>Unauthorized</h1>
            <p>You are not allowed to access this resource</p>
            <a href="/" style={{color:'blue', textDecoration:'underline'}}>Go Back</a>
        </div>
    );
}

export default Unauthorized;
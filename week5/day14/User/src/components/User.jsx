function User(props){
    let {user}=props;

    return(
        <div>
            <h2 className="text-center p-5 shadow-xl">{user.name}</h2>
            <p>{user.email}</p>
            <img src={user.image} />
        </div>
    )
}
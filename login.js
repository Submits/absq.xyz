var faunadb = window.faunadb
var q = faunadb.query
var client = new faunadb.Client({
  secret: 'fnAEhgo6CoAAwWq8oF1VfjvulHEylVcOMB2UsUj9',
  domain: 'db.eu.fauna.com',
  scheme: 'https',
})


function logIn(){

 
  if(document.getElementById("username").value == "" || document.getElementById("password").value == "")
  {
    toastr.error("Please fill out all credentials.")

  }
  else{


    client.query(
      q.Get(
        q.Match(q.Index('user_by_name'), document.getElementById("username").value)
      )
    )
          
    .then(function(ret) {
                          
      if(ret.data.password != document.getElementById("password").value)  
      {
        toastr.error("User and password do not match!")
      }
      else{
       
        localStorage.setItem("absqId", ret.data.id)
        localStorage.setItem("absqUsername", ret.data.username)
        window.location.href = "new.html"
      }
    })
    .catch(function(e){
      toastr.error("User not found.")
    });


  }

}

function check(){

  if(localStorage.getItem("absqId") != null && localStorage.getItem("absqUsername") != null)
  {
    window.location.href = "new.html"
  }
}
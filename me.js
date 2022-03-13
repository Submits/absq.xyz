var faunadb = window.faunadb
var q = faunadb.query
var client = new faunadb.Client({
  secret: 'fnAEhgo6CoAAwWq8oF1VfjvulHEylVcOMB2UsUj9',
  domain: 'db.eu.fauna.com',
  scheme: 'https',
})

let pastecount = 0

let users = []



function checkIfLoggedIn(){
    if(localStorage.getItem("absqId") == null && localStorage.getItem("absqUsername") == null)
  {
    window.location.href = "login.html"
  }
  else{
    getInfo()
  }

}

function getInfo(){
    client.query(
        q.Get(
          q.Match(q.Index('user_by_id'), parseInt(localStorage.getItem("absqId")))
        )
      )
      .then(function(ret){ 
           
        document.getElementById("username").value = ret.data.username
        document.getElementById("password").value = ret.data.password
        document.getElementById("pfp").value = ret.data.profile_image
        document.getElementById("bio").value = ret.data.bio
        document.getElementById("colour").value = ret.data.colour
      
      })
        
      .catch(function(e){
      
      window.location.href = "login.html"
      
      });

      client
      .query(
        q.Map(
          q.Paginate(q.Documents(q.Collection("pastes")), { size: 1000 }),
          q.Lambda("X", q.Get(q.Var("X")))
        )
      )
      .then(function (x) {
         
        x.data.reverse()

        
        for (let i = 0; i < x.data.length; i++) {
        pastecount += 1
            if(x.data[i].data.author_id == localStorage.getItem("absqId"))
            {
                console.log(x.data[i])
                document.getElementById("pastes").innerHTML += `  <div id="pasteDiv-` + x.data[i].ref.value.id  + `" class="pasteDiv">
                <label class="loginLabel">&nbsp;Title</label><br>
                <input id="title-` + x.data[i].ref.value.id + `" class="pasteInput" value="` + x.data[i].data.title +`" type="text" placeholder="Title"><br><br>
                <label class="loginLabel">&nbsp;Content</label><br>
                <textarea id="content-` + x.data[i].ref.value.id + `" placeholder="Content" class="pasteTextArea">` + x.data[i].data.content + `</textarea><br><br>
                <div style="text-align: left;">
                <a style="color:white" href="index.html?id=` + x.data[i].data.id + `">https://submits.github.io?id=` + x.data[i].data.id  + `</a><br><br>
                    <button onclick="save('` + x.data[i].ref.value.id  + `')" class="saveButton">Save</button>
                    <button onclick=deletePaste('` + x.data[i].ref.value.id + `') class="redButton">Delete</button>
                </div>
                </div>`
            }

        }
               document.getElementById("yourpastes").innerText = "Your Pastes [" + pastecount + "]"
  
      });


}


function save(pasteid){

    console.log("title-" + pasteid)
    
        client.query(
          q.Update(q.Ref(q.Collection("pastes"), pasteid), {
          data: {
            title: document.getElementById("title-" + pasteid).value,
            content: document.getElementById("content-" + pasteid).value,
            edited: true
  
  
          },
          })
          ).then(function(ret){
      
            toastr.success("Paste ID " + ret.data.id + " Updated successfully!")
      
        }).catch(function(e){
      
            toastr.error("Unable to update paste. Try again later.")
      
        });
      
      

}

function deletePaste(pasteid){

    client.query(
        q.Delete(q.Ref(q.Collection('pastes'), pasteid)
      ))
      document.getElementById("pasteDiv-" + pasteid).remove()
      toastr.success("Paste deleted successfully!")
    pastecount -= 1
    document.getElementById("yourpastes").innerText = "Your Pastes [" + pastecount + "]"

}

function saveProfile(){

 
    if(document.getElementById("username").value == "" || document.getElementById("password").value == "" ||  document.getElementById("pfp").value == ""){
        toastr.error("You cannot leave your username, password, or profile image empty!")

    }
    else{
    client.query(
        q.Get(
          q.Match(q.Index('user_by_id'), parseInt(localStorage.getItem("absqId")))
        )
      )
      .then(function(ret){ 
           
        client.query(
          q.Update(q.Ref(q.Collection("users"), ret.ref.value.id), {
          data: {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
            profile_image: document.getElementById("pfp").value,
            bio: document.getElementById("bio").value,
            colour:  document.getElementById("colour").value
  
  
          },
          })
          ).then(function(ret){ 
          toastr.success("Your profile has been saved successfully!")
          localStorage.setItem("absqId", ret.data.id)
          localStorage.setItem("absqUsername", ret.data.username)
          document.getElementById("username").value = ret.data.username
        document.getElementById("password").value = ret.data.password
        document.getElementById("pfp").value = ret.data.profile_image
        document.getElementById("bio").value = ret.data.bio
        document.getElementById("colour").value = ret.data.colour
          


          })
      
      })
        
      .catch(function(e){
      
      toastr.error("Unable to save profile. Try again later.")
      
      });
    }

}

function logOut(){

    localStorage.removeItem('absqId');
    localStorage.removeItem('absqUsername');
    window.location.href = "login.html"
}

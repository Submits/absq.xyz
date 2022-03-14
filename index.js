var faunadb = window.faunadb
var q = faunadb.query
var client = new faunadb.Client({
  secret: 'fnAEhgo6CoAAwWq8oF1VfjvulHEylVcOMB2UsUj9',
  domain: 'db.eu.fauna.com',
  scheme: 'https',
})

function sleep(milisec) {
    return new Promise(resolve => {
    setTimeout(() => { resolve('') }, milisec);
    })
    }

let users = []
let username = ""


async function getAllUsers(){

    client
    .query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("users")), { size: 1000 }),
        q.Lambda("X", q.Get(q.Var("X")))
      )
    )
    .then(function (x) {
        for (let i = 0; i < x.data.length; i++) {
        users.push({id: x.data[i].data.id, username:  x.data[i].data.username, profile_image:  x.data[i].data.profile_image, user_colour: x.data[i].data.colour, sparkle: x.data[i].data.sparkle})
        }

    });

    console.log(users)
   

}

async function getPasteInfo(){

      getAllUsers()
      await sleep(500)
      getPaste()
  }

  function getPaste(){

    
    let urlParams = new URLSearchParams(window.location.search);

    client.query(
        q.Get(
          q.Match(q.Index('paste_by_id'), urlParams.get('id'))
        )
      )
      .then(function(ret) {    
        let content = ret.data.content 
        let userinfo = users.findIndex(function(item, i) {
            return item.id === ret.data.author_id
          });
 
          console.log(users[userinfo])
          console.log(ret.data)

         let images = content.match(/\[image\](http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)\[image\]/g)
        if(images != null){
        for (let i = 0; i < images.length; i++) {
          content = content.replace(images[i], "<img style=\"max-height:300px;\" src=\"" + images[i].replace(/\[image\]/g, "")  + "\">")
        }
      }
      
      let sparkle = ""
        if(users[userinfo].sparkle == true)
      {
            sparkle = "background-image: url('https://cdn.doxbin.com/gold.gif')"
      }

          document.getElementById("title").innerHTML = ret.data.title
         
          document.getElementById("info").innerHTML = `Uploaded by <a style="color:` + users[userinfo].user_colour + `;` + sparkle +`" href="https://www.absq.xyz/profile?id=` + users[userinfo].id  + `"><b>` + users[userinfo].username + `</b></a> on <b>` + ret.data.timestamp + "</b><br>Device: <b>" + ret.data.device + "</b>"
          document.getElementById("content").innerHTML = content.replace(/\n/g, "<br>")
          if(ret.data.edited == true)
          {
            document.getElementById("content").innerHTML += "<br><br><label style=\"color:#828282\"><i>This paste has been edited.</i></label>"
          }
          document.title = "AbSq || " + ret.data.title + " by " + users[userinfo].username
      
      
      
      if(localStorage.getItem("absqId") == null && localStorage.getItem("absqUsername") == null)
          {
            document.getElementById("leaveComment").innerHTML = "Leave a comment as <b>" + "Anonymous" + "</b>"
          }
          else{
            document.getElementById("leaveComment").innerHTML = "Leave a comment as <b>" + localStorage.getItem("absqUsername") + "</b>"
          }
          ret.data.comments.reverse()
          for (let i = 0; i < ret.data.comments.length; i++) {
let userinfopos = ""

            if(ret.data.comments[i].user_id == 0)
            {
              username = "Anonymous"
            }
            else{
            userinfopos = users.findIndex(function(item, z) {
              return item.id === ret.data.comments[i].user_id
            });
            username = users[userinfopos].username

          }

          let sparkle = ""
          if(users[userinfo].sparkle == true && ret.data.comments[i].user_id != 0)
        {
              sparkle = "background-image: url('https://cdn.doxbin.com/gold.gif')"
        }

        let colour = ""
        if(ret.data.comments[i].user_id == 0){
          colour = "#ffffff"
        }
        else{
          colour = users[userinfopos].user_colour
        }

        let href = ""
        if(ret.data.comments[i].user_id == 0){
          href = ""
        }
        else{
          href = "href= \"https://www.absq.xyz/profile?id=" + users[userinfopos].id + "\""
        }


          
          document.getElementById("comments").innerHTML += `<div class="comment">
          <a ` + href + ` style="font-size: 16px;` + sparkle + `; color: ` + colour + `"><b>` + username + `</b> </a> &bull;<label style="color: #adadad;"> ` +  ret.data.comments[i].timestamp + `</label><br>
          <p>` + ret.data.comments[i].content + `</p>
      </div>`

            

          }


          
          
          
      })
      .catch(function(e){
         document.write(`
         <style>
         body{

            font-family: sans-serif;
            text-align:center;
         }
         </style>
         <br><br><h1>404</h1><br>Error: <b>` +  e + `</b>
         <br><br>Are you trying to go to the <a href="home.html">home page</a>?`)
      });


    
  }






function postComment(){

    let urlParams = new URLSearchParams(window.location.search);
    if( document.getElementById("commentText").value == "")
    {
        toastr.error("Please fill out all fields before posting a comment.")
    }
    else
    {
client.query(
q.Get(
q.Match(q.Index('paste_by_id'), urlParams.get('id'))
)
)
.then(function(ret){ 

  let userId = ""
  if(localStorage.getItem("absqId") == null)
  {
    userId = 0
  }
  else{
    userId = parseInt(localStorage.getItem("absqId"))
  }
let newTime = new Date();
let comments = ret.data.comments
comments.push({timestamp: newTime.toUTCString(), content: document.getElementById("commentText").value, user_id: userId})
client.query(
q.Update(q.Ref(q.Collection("pastes"), ret.ref.value.id), {
data: {
  comments: comments
},
})
);

toastr.success("Message posted!")
})

.catch(function(e){


console.log(e)

});

    }
    
}

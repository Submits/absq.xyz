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
        users.push({id: x.data[i].data.id, username:  x.data[i].data.username, profile_image:  x.data[i].data.profile_image, user_colour: x.data[i].data.colour})
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

          /*let images = content.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g)
          if(images != null){
          for (let i = 0; i < images.length; i++) {
            content = content.replace(images[i], "<img style=\"max-height:300px;\" src=\"" + images[i] + "\">")
          }
        }*/

          document.getElementById("title").innerHTML = ret.data.title
         
          document.getElementById("info").innerHTML = `Uploaded by <a style="color:` + users[userinfo].user_colour + `" href="https://www.absq.xyz/profile?id=` + users[userinfo].id  + `"><b>` + users[userinfo].username + `</b></a> on <b>` + ret.data.timestamp + "</b><br>Device: <b>" + ret.data.device + "</b>"
          document.getElementById("content").innerHTML = content.replace(/\n/g, "<br>")
          if(ret.data.edited == true)
          {
            document.getElementById("content").innerHTML += "<br><br><label style=\"color:#828282\"><i>This paste has been edited.</i></label>"
          }
          document.title = "AbSq || " + ret.data.title + " by " + users[userinfo].username


          
          
          
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

var faunadb = window.faunadb
var q = faunadb.query
var client = new faunadb.Client({
  secret: 'fnAEhgo6CoAAwWq8oF1VfjvulHEylVcOMB2UsUj9',
  domain: 'db.eu.fauna.com',
  scheme: 'https',
})

let urlParams = new URLSearchParams(window.location.search);

function getProfileData(){

    client.query(
        q.Get(
          q.Match(q.Index('user_by_id'), parseInt(urlParams.get("id")))
        )
      )
            
      .then(function(ret) {
       
        let verified = ""
        let admin = ""
        let dev = ""
          if(ret.data.verified == true)
          {
              verified = `<i style="color:#1DA1F2; margin-left:5px; font-size:14px;" class="fas fa-badge-check"></i>`
          }

          if(ret.data.admin == true)
          {
              admin = `<i style="color:#d6220b; margin-left:5px; font-size:14px;" class="fas fa-user-shield"></i>`
          }
          if(ret.data.dev == true)
          {
              dev = `<i style="color:#575457; margin-left:5px; font-size:14px;" class="fas fa-cog"></i>`
          }

        document.getElementById("username").style.color = ret.data.colour
    document.getElementById("username").innerHTML = "<b>" + ret.data.username + "</b>" + verified + admin + dev
    document.getElementById("pfp").src = ret.data.profile_image
    document.getElementById("uid").innerHTML = "UID: <b>" + ret.data.id + "</b>"
    document.getElementById("bio").innerHTML = ret.data.bio.replace(/\n/g, "<br>")
    document.title = "AbSq || " + ret.data.username

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

          if(x.data[i].data.author_id == ret.data.id)
          {
                  pastecount += 1
              console.log(x.data[i])
             document.getElementById("pastes").innerHTML += `<div class="paste">
             <a href="https://submits.github.io?id=` + x.data[i].data.id + `" style="color: white; font-size: 20px;"><b>` +  x.data[i].data.title + `</b></a><br><br>
             <p>Uploaded: <b>` +  x.data[i].data.timestamp + `</b><br>Device: <b>` +  x.data[i].data.device + `</b></p>
                     </div>`
          }

      }
      document.getElementById("pastecount").innerText = "Pastes [" + pastecount + "]"

    });



      })
      .catch(function(e){
       document.write(`
         Oopsie Daises!!!!!! 404!!!!!<br>Error: ` +  e + `
         `)
         console.error(e)
      });

}

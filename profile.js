var faunadb = window.faunadb
var q = faunadb.query
var client = new faunadb.Client({
  secret: 'fnAEhgo6CoAAwWq8oF1VfjvulHEylVcOMB2UsUj9',
  domain: 'db.eu.fauna.com',
  scheme: 'https',
})

let pastecount = 0

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
      if(ret.data.sparkle == true)
      {
            document.getElementById("username").style.backgroundImage = "url('https://cdn.doxbin.com/gold.gif')"
      }

      
      
       let bio = ret.data.bio
            let embeds = bio.match(/\[embed\]https:\/\/www.youtube\.com\/embed\/(([a-zA-Z0-9-_]){11})\[embed\]/g)
          if(embeds != null){
          for (let i = 0; i < embeds.length; i++) {
            bio = bio.replace(embeds[i], `<iframe style="border:none; border-radius:5px; width:100%; height:300px;" src="` + embeds[i].replace(/\[embed\]/g, "") + `"></iframe>`)
          }
        }

        let images = bio.match(/\[image\](http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)\[image\]/g)
        if(images != null){
        for (let i = 0; i < images.length; i++) {
          bio = bio.replace(images[i], "<img style=\"max-height:300px;\" src=\"" + images[i].replace(/\[image\]/g, "")  + "\">")
        }
      }

        document.getElementById("username").style.color = ret.data.colour
    document.getElementById("username").innerHTML = "<b>" + ret.data.username + "</b>" + verified + admin + dev
    document.getElementById("pfp").src = ret.data.profile_image
    document.getElementById("uid").innerHTML = "UID: <b>" + ret.data.id + "</b>"
    document.getElementById("bio").innerHTML = bio.replace(/\n/g, "<br>")
    document.title = "AbSq || " + ret.data.username
      
      
    if(ret.data.private_pastes == true)
    {

      document.getElementById("pastes").innerHTML = "<div style=\"text-align:center\"><p><b>" + ret.data.username + "</b> has privated their pastes.</p></div>"
    }
    else{


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
             <p style="font-size:15px">Uploaded: <b>` +  calcDate(new Date(x.data[i].data.timestamp)) + `</b><br>Device: <b>` +  x.data[i].data.device + `</b></p>
                     </div>`
          }

      }
      document.getElementById("pastecount").innerText = "Pastes [" + pastecount + "]"

    });

    }

      })
      .catch(function(e){
       document.write(`
         Oopsie Daises!!!!!! 404!!!!!<br>Error: ` +  e + `
         `)
         console.error(e)
      });

}

function calcDate(date)
    {
dateNow = new Date();
dateThen = new Date(date);
const diffTime = Math.abs(dateThen - dateNow);
let seconds = Math.round(diffTime / 1000)
let minutes = Math.round(diffTime / 1000 / 60)
let hours =  Math.round(diffTime / 1000 / 60 / 60)
let days = Math.round(diffTime / 1000 / 60 / 60 / 24)
let years = Math.round(diffTime / 1000 / 60 / 60 / 24 / 365)

        
       if(seconds >= 1 && seconds < 60){
    return seconds + " seconds ago"
}
else if(minutes >= 1 && minutes < 60){
    return minutes + " minutes ago"
}
else if(hours >= 1 && hours < 24){
    return hours + " hours ago"
}
else if(days >= 1 && days < 365){
    return days + " days ago"
}
else if(years >= 1){
    return years + " years ago"
}
        
    }

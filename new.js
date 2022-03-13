var faunadb = window.faunadb
var q = faunadb.query
var client = new faunadb.Client({
  secret: 'fnAEhgo6CoAAwWq8oF1VfjvulHEylVcOMB2UsUj9',
  domain: 'db.eu.fauna.com',
  scheme: 'https',
})

function checkIfLoggedIn(){
    if(localStorage.getItem("absqId") == null && localStorage.getItem("absqUsername") == null)
  {
    window.location.href = "login.html"
  }

}

function generateId(length) {
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "Tablet";
    }
    if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      return "Mobile";
    }
    return "Desktop";
  };

function makePaste(){

    let date = new Date();
    client.query(
        q.Create(
          q.Collection('pastes'),
          { data: {id: generateId(6), title: document.getElementById("title").value, content: document.getElementById("content").value, author_id: parseInt(localStorage.getItem("absqId")), timestamp: date.toUTCString(), comments:[], device: getDeviceType()} },
        )
      )
      .then(function(ret){
      
        toastr.success("Posted!")
        document.getElementById("pasteID").innerHTML += "<br><br>" + ret.data.title + " - <a style=\"color:white\" href=\"" + "https://www.absq.xyz/?id=" + ret.data.id + "\">https://www.absq.xyz/?id=" + ret.data.id + "</a>"
          })
}

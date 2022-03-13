var faunadb = window.faunadb
var q = faunadb.query
var client = new faunadb.Client({
  secret: 'fnAEhgo6CoAAwWq8oF1VfjvulHEylVcOMB2UsUj9',
  domain: 'db.eu.fauna.com',
  scheme: 'https',
})

function getStats(){

    client
    .query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("users")), { size: 1000 }),
        q.Lambda("X", q.Get(q.Var("X")))
      )
    )
    .then(function (x) {
       document.getElementById("usercount").innerHTML =  "<b>" + x.data.length.toString() + "</b>"

    });

    client
    .query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("pastes")), { size: 1000 }),
        q.Lambda("X", q.Get(q.Var("X")))
      )
    )
    .then(function (x) {
       document.getElementById("postcount").innerHTML = "<b>" + x.data.length.toString() + "</b>"

    });

    let date = new Date();
    document.getElementById("datacorrect").innerHTML = "<i>Data correct as of: " + date.toLocaleString() + "</i>"

}



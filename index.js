var request = require('request-promise')
var fs = require('fs');
var path = require('path')
var _ = require('lodash')
var Promise = require('bluebird');
const { result, indexOf } = require('lodash');


// console.log(array)
// for (i in array) {
//   console.log(array[i]);
// }

const nossaFuncao = function (options, id) {

  var defaults = {
    baseURL: 'https://api.discogs.com',
    id: id,
    outputDir: process.cwd(),
    token: 'IThDdQFTqbmyKxElQQYjZqQeWqPtipCJHnkguGvb',
    userAgentURL: null
  }

  options = _.merge({}, defaults, options)

  var requestOptions = {
    json: true,
    gzip: true,
    headers: {
      'User-Agent': 'http://yourwebsite.com/'
    },
    qs: {
      token: options.token
    }
  }
  var url = options.baseURL + options.id
  if (!requestOptions.qs.token) {
    return Promise.reject(new Error('No API token provided'))
  }
  return request.get(url, requestOptions).then(function (response) {
    let obj = {
      year: response.year,
      name: response.title,
      catno: response.labels[0].catno,
      country: response.country

    }
    // console.log(obj)
    return obj
  })

}
// let result1 = nossaFuncao({}, '/releases/2838477').then(res => {
//   console.log(res)
// })
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const getTheResult = (link) => {
  return sleep(5000).then(v => nossaFuncao({}, link)).catch(err => console.log(err))
}
const results = []

const control = async () => {
  try {
    var array = fs.readFileSync('releases.txt').toString().split("\n");
    let count = 0;
    for (el of array) {
      let res = await getTheResult(el)
      // let res = await getTheResult('/releases/7423931')
      res = {
        ...res,
        link: el
      }
      results.push(res)
      console.log(res)
      console.log(count)
      count++
    }
    fs.writeFileSync('./results.json', JSON.stringify(results))
    console.log(results)

  } catch (err) {
    console.log(err)
    results.push(res)
  }
}
control()


/**
 ----- For Loop to fire await -----
 for (el of array) {
   setTimeout(async function (el2) {
     try {
       let newObj = await nossaFuncao({}, el2)
       results.push(newObj)
     } catch (err) {
       console.log(err.body)
     }
   }, 5000, el)
 }
*/




// /releases/{release_id}{?curr_abbr}
// var url = options.baseURL + options.requestURL
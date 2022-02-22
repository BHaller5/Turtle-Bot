const { data } = require('cheerio/lib/api/attributes')
const fetch = require('node-fetch')

const self = module.exports = {
    token: {},
    login,
    search
}

async function login() {

}

async function search(searchTerm) {
    let returnObject = {}
    let url = new URL('https://api.mangadex.org/manga?')
    let res = await fetch(url + new URLSearchParams({
        title: searchTerm
    }))
    let resJSON = await res.json() // returns an array of all the manga
    if (resJSON.data.length === 0) return null
    // console.log(resJSON.data)
    let id = resJSON.data[0].id
    let title = Object.values(resJSON.data[0].attributes.title)[0]
    // let title = resJSON.data[0].attributes
    let altTitles = resJSON.data[0].attributes.altTitles
    let altTitlesObject = altTitles.reduce((obj, item) => (obj[Object.keys(item)[0]] = Object.values(item)[0], obj), {})
    console.log('id', id)
    console.log('title', title)
    console.log('altTitlesObject', altTitlesObject)
    returnObject.title = title
    url = new URL(`https://api.mangadex.org/cover?`)
    url.searchParams.append('manga[0]', id)
    let cover = await fetch(url)
    let coverJSON = await cover.json()
    console.log('cover', coverJSON)

    url = new URL(`https://api.mangadex.org/cover/${coverJSON.data[data.length - 1].id}`)
    let newCover = await fetch(url)
    let newCoverJSON = await newCover.json()
    console.log('new cover', newCoverJSON)
    let coverLink = `https://uploads.mangadex.org/covers/${id}/${newCoverJSON.data.attributes.fileName}`
    returnObject.coverLink = coverLink
    returnObject.coverLinkArray = [
        'https://uploads.mangadex.org/covers/46e9cae5-4407-4576-9b9e-4c517ae9298e/97b244ef-5179-4e21-bbba-099c5f129bda.jpg',
        'https://uploads.mangadex.org/covers/46e9cae5-4407-4576-9b9e-4c517ae9298e/b26bcf6a-1060-465c-8768-f662ddef866d.jpg',
        'https://uploads.mangadex.org/covers/46e9cae5-4407-4576-9b9e-4c517ae9298e/a5677919-ce8c-438e-8eb8-cabcb4d906a1.jpg'
    ]
    return returnObject
}

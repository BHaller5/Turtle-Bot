const { data } = require('cheerio/lib/api/attributes')
const fetch = require('node-fetch')

const self = module.exports = {
    token: {},
    login,
    search
}

async function login() {

}



// what to work on: 
// search manga: Grabs an array for all valid searched manga. Includes: [ { relationships: '', title: '', mangaID: '', altTitles: { } }]
//          grab a single cover (first one probably)
//          get author names with ids in relationships
//          return an array [ [{ authors: [], title: '', mangaID: '', altEN: '', altJA: '', coverlink: '' }], ... ]






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
    returnObject.id = id
    let title = Object.values(resJSON.data[0].attributes.title)[0]
    let relationships = resJSON.data[0].relationships

    let authors = await getAuthors(relationships)
    returnObject.authors = authors
    // let title = resJSON.data[0].attributes
    let altTitles = resJSON.data[0].attributes.altTitles
    let altTitlesObject = altTitles.reduce((obj, item) => (obj[Object.keys(item)[0]] = Object.values(item)[0], obj), {})
    // console.log('id', id)
    // console.log('title', title)
    // console.log('altTitlesObject', altTitlesObject)
    returnObject.title = title
    returnObject.altTitles = []
    returnObject.altEN = altTitles.en
    returnObject.altJA = altTitles.ja
    altTitlesObject.en ? returnObject.altTitles.push(altTitlesObject.en) : ''
    altTitlesObject.ja ? returnObject.altTitles.push(altTitlesObject.ja) : ''
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
    console.log('coverLink', coverLink)

    return returnObject
}

async function getAuthors(relationships) {
    let authorNames = []
    for (let i = 0; i < relationships.length; i++) {
        if (relationships[i].type !== "author") continue
        let authorID = relationships[i].id
        let url = new URL(`https://api.mangadex.org/author/${authorID}`)
        let res = await fetch(url)
        let resJSON = await res.json()
        authorNames.push(resJSON.data.attributes.name)
    }
    console.log('author names', authorNames)
    return authorNames
}

async function main() {
    await search('yakusoku')
}

main()
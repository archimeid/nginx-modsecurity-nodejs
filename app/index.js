const _ = require('lodash')
const express = require('express')
const app = express()
const port = 3000

const artists = []

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Home')
})

const api_v1 = express.Router()

function get_artist(username) {
    return _.find(artists, { 'username': username })
}

api_v1.get('/artists', (req, res) => {
  res.json({
      artists: artists
  })
})

api_v1.post('/artists', (req, res) => {
    if (req.body.artist && req.body.artist.username) {
        if (get_artist(req.body.artist.username)) {
            res.status(403).json({
                error: "This username is not available. Please, use another."
            })
        }

        artists.push(req.body.artist)

        res.status(201).json({
            added: {
                artist: req.body.artist
            }
        })
    } else {
        res.status(400).json({
            error: "Missing artist object in JSON body."
        })
    }

})

api_v1.get('/artists/:username', (req, res) => {
    const artist = get_artist(req.params.username)
    if (artist) {
        res.json(artist)
    } else {
        res.status(404).json({
            error: "Artist not found"
        })
    }
})

app.use('/api/v1', api_v1)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


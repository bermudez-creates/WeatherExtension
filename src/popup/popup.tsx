import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Grid, Box, InputBase, IconButton, Paper } from '@material-ui/core'
import {
  Add as AddIcon,
  PictureInPicture as PictureInPictureIcon,
} from '@material-ui/icons'
import '@fontsource/roboto'
import './popup.css'
import WeatherCard from '../components/WeatherCard'
import {
  setStoredOptions,
  getStoredOptions,
  setStoredCities,
  getStoredCities,
  LocalStorageOptions,
} from '../apikey/storage'
import { Messages } from '../apikey/messages'

const App: React.FC<{}> = () => {
  const [cities, setCities] = useState<string[]>([])
  const [cityInput, setCityInput] = useState<string>('')
  const [options, setOptions] = useState<LocalStorageOptions | null>(null)

  useEffect(() => {
    getStoredCities().then((cities) => setCities(cities))
    getStoredOptions().then((options) => setOptions(options))
  }, [])

  const handleCityButtonClick = () => {
    if (cityInput === '') {
      return
    }
    const updatedCities = [...cities, cityInput]
    setStoredCities(updatedCities).then(() => {
      setCities(updatedCities)
      setCityInput('')
    })
  }

  const handleCityDeleteButtonClick = (index: number) => {
    cities.splice(index, 1)
    const updatedCities = [...cities, cityInput]
    setStoredCities(updatedCities).then(() => {
      setCities(updatedCities)
    })
  }

  const handleTempScaleButtonClick = () => {
    const updateOptions: LocalStorageOptions = {
      ...options,
      tempScale: options.tempScale === 'metric' ? 'imperial' : 'metric',
    }
    setStoredOptions(updateOptions).then(() => {
      setOptions(updateOptions)
    })
  }

  const handleOverlayButtonClick = () => {
    chrome.tabs.query(
      {
        active: true,
      },
      (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, Messages.TOGGLE_OVERLAY)
        }
      }
    )
  }

  if (!options) {
    return null
  }

  return (
    <Box mx="15px" my="15px">
      <Grid container justifyContent="space-evenly">
        <Grid item>
          <Paper>
            <Box px="50px" py="10px">
              <InputBase
                placeholder="Add a city!"
                value={cityInput}
                onChange={(event) => setCityInput(event.target.value)}
              />
              <IconButton onClick={handleCityButtonClick}>
                <AddIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>

        <Grid item>
          <Paper>
            <Box px="2px" py="8px">
              <IconButton onClick={handleTempScaleButtonClick}>
                {options.tempScale === 'metric' ? '\u2103' : '\u2109'}
              </IconButton>
            </Box>
          </Paper>
        </Grid>

        <Grid item>
          <Paper>
            <Box py="8px">
              <IconButton onClick={handleOverlayButtonClick}>
                <PictureInPictureIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {options.homeCity != ' ' && (
        <WeatherCard city={options.homeCity} tempScale={options.tempScale} />
      )}
      {cities.map((city, index) => (
        <WeatherCard
          city={city}
          tempScale={options.tempScale}
          key={index}
          onDelete={() => handleCityDeleteButtonClick(index)}
        />
      ))}
      <Box height="15px" />
    </Box>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)

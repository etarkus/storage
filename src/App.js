import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { CssBaseline, Grid, Container, Typography } from '@material-ui/core'

import Toolbar from './Toolbar'
import FileCard from './FileCard'
import storage from './storage'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  toolbar: {
    marginBottom: theme.spacing(2),
  },
  title: {
    color: theme.palette.text.secondary,
    paddingBottom: theme.spacing(1),
  },
}))

function App() {
  const [files, setFiles] = React.useState([])
  const [selected, setSelected] = React.useState([])
  const s = useStyles()

  // Loads the list of files from API
  const load = React.useCallback(() => {
    storage.getFiles().then(x => {
      window.localStorage.setItem('storage:files', JSON.stringify(x))
      setFiles(x)
      setSelected([])
    })
  }, [])

  // Refreshes the list of files right after the initial render is complete
  React.useEffect(() => {
    const x = window.localStorage.getItem('storage:files')
    if (x) setFiles(JSON.parse(x))
    load()
  }, [load])

  const handleDelete = React.useCallback(() => {
    storage.delete(selected).then(load)
  }, [selected, load])

  const handleUpload = React.useCallback(
    files => Promise.all(files.map(storage.upload)).then(load),
    [load],
  )

  const toggleSelect = React.useCallback(event => {
    const { id } = event.currentTarget.dataset
    setSelected(x => (x.includes(id) ? x.filter(x => x !== id) : [...x, id]))
  }, [])

  return (
    <CssBaseline>
      <Container className={s.root} maxWidth="md">
        <Toolbar
          className={s.toolbar}
          onUpload={handleUpload}
          onDelete={selected.length ? handleDelete : null}
        />
        <Typography className={s.title} variant="subtitle2">
          Files
        </Typography>
        <Grid container spacing={2}>
          {files.map(x => (
            <Grid key={x.id} item xs={6} sm={4} md={3}>
              <FileCard
                data-id={x.id}
                name={x.name}
                selected={selected.includes(x.id)}
                onClick={toggleSelect}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </CssBaseline>
  )
}

export default App

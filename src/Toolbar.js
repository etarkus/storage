import clsx from 'clsx'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { CloudUpload, Delete } from '@material-ui/icons'
import { Typography, IconButton } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  title: {
    flexGrow: 1,
  },
}))

function Toolbar(props) {
  const { className, onUpload, onDelete, ...other } = props
  const inputRef = React.useRef()
  const s = useStyles()

  function handleUploadClick() {
    inputRef.current.click()
  }

  function handleUploadChange(event) {
    const files = Array.from(event.target.files)
    event.target.value = ''
    onUpload(files)
  }

  return (
    <div className={clsx(s.root, className)} {...other}>
      <Typography className={s.title} variant="h5">
        Cloud Storage
      </Typography>
      {onDelete && (
        <IconButton onClick={onDelete}>
          <Delete />
        </IconButton>
      )}
      <IconButton onClick={handleUploadClick}>
        <CloudUpload />
        <input
          ref={inputRef}
          type="file"
          style={{
            visibility: 'hidden',
            position: 'absolute',
            zIndex: -1,
          }}
          onChange={handleUploadChange}
        />
      </IconButton>
    </div>
  )
}

export default Toolbar

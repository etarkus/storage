import clsx from 'clsx'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, CardMedia, CardContent } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    '&:hover': {
      cursor: 'pointer',
      boxShadow: theme.shadows[5],
    },
  },
  media: {
    height: 120,
  },
  content: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '&:last-child': {
      paddingBottom: theme.spacing(2),
    },
  },
  selected: {
    '& $content': {
      fontWeight: 'bold',
      backgroundColor: 'rgba(0, 255, 255, 0.3)',
    },
  },
}))

function getUrl(file) {
  const url = new URL(
    'http://us-central1-kriasoft.cloudfunctions.net/storage-demo/get',
  )
  url.searchParams.set('file', file)
  return url.toString()
}

function FileCard(props) {
  const { className, name, selected = false, ...other } = props
  const s = useStyles()

  return (
    <Card
      className={clsx(s.root, className, { [s.selected]: selected })}
      {...other}
    >
      <CardMedia className={s.media} image={getUrl(name)} title={name} />
      <CardContent className={s.content}>{name}</CardContent>
    </Card>
  )
}

export default FileCard

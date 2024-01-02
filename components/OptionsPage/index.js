import styles from './index.module.css'

export default function OptsPage({opts}) {
  const atags = opts.map((str) => {
    const href = str.replaceAll(' ', '');
    return (

      <a href={href} key={href} className={styles.opt}>
        {str}
      </a>
    )
  })

  return (
    <body id={styles.body}>
      <div id={styles.header}>
        ਸੁਣਿਐਦੂਖਪਾਪਕਾਨਾਸੁ॥੮॥
        <div id='GurbaniLine'></div>
        <div id='GurbaniTrans'>Listening, pain and sin are erased</div>
      </div>
      <div id={styles.optsParent}>{atags}</div>
    </body>
  )
}

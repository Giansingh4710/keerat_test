export default function Header({ title }) {
  return (
    <div className='border' style={styles.headingDiv}>
      <h1>{title}</h1>
    </div>
  )
}
const styles = {
  headingDiv: {
    margin: '10px',
    padding: '0px',
  },
}

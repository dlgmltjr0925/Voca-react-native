import { baseColor } from '../colors'
const baseStyle = {
  container: {
    flex: 1, 
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  headerContainer: {
    backgroundColor: baseColor.mainContainer,
    borderBottomWidth: 1,
    borderBottomColor: baseColor.border,
    paddingBottom: 10,
  },
  searchBar: {
    flex: 1,
    justifyContent: 'flex-start', 
    height: 30,
    borderRadius: 10,
    margin: 10, 
    marginBottom: 0, 
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: baseColor.searchBody
  },
  circle: {
    height: 5,
    width: 5,
    borderRadius: 2.5,
    marginRight: 2
  }
}

export default baseStyle;
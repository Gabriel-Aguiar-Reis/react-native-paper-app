import React from 'react'
import { Searchbar, Surface, Text } from 'react-native-paper'
import { styles } from '@/lib/ui'

const Search = () => {
  const [query, setQuery] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (query !== '') {
      setLoading(true)
    }

    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [query])

  return (
    <Surface style={{ flex: 1, gap: 16 }}>
      <Searchbar
        value={query}
        loading={loading}
        onChangeText={(v) => setQuery(v)}
        placeholder="Digite aqui para pesquisar..."
        style={{ marginTop: 16, marginHorizontal: 16 }}
      />

      <Surface style={styles.screen}>
        <Text>Hello Produtos</Text>
      </Surface>
    </Surface>
  )
}

export default Search

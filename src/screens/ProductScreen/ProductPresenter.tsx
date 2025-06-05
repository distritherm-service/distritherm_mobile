import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

interface ProductPresenterProps {
  product: any;
}

const ProductPresenter = ({ product }: ProductPresenterProps) => {
  return (
    <View>
      <Text>ProductPresenter</Text>
    </View>
  )
}

export default ProductPresenter

const styles = StyleSheet.create({})
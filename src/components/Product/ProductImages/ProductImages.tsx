import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ProductImagesPresenter from "./ProductImagesPresenter";

interface ProductImagesProps {
  images?: string[];
}

const ProductImages: React.FC<ProductImagesProps> = ({ images = [] }) => {
  return <ProductImagesPresenter images={images} />;
};

export default ProductImages;

const styles = StyleSheet.create({});

import React from 'react'
import { client } from "@/sanity/lib/client"

const categories = await client.fetch(`{
  "cocktails": *[_type == "beer"]{style},
}`)
console.log(categories)
const CatalogTabs = () => {
  return (
    <div>CatalogTabs</div>
  )
}

export default CatalogTabs
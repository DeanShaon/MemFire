import { FC } from 'react'
import { removeAnchor } from './CustomHTMLElements/CustomHTMLElements.utils'

const formatSlug = (slug: string) => {
  // [Joshen] We will still provide support for headers declared like this:
  //    ## REST API {#rest-api-overview}
  // At least for now, this was a docusaurus thing.
  if (slug.includes('#')) return slug.split('#')[1]
  return slug
}

const formatTOCHeader = (content: string) => {
  let begin = false
  const res = []
  for (const x of content) {
    if (x === '`') {
      if (!begin) {
        begin = true
        res.push(`<code class="text-xs border rounded bg-scale-400 border-scale-500">`)
      } else {
        begin = false
        res.push(`</code>`)
      }
    } else {
      res.push(x)
    }
  }
  return res.join('')
}

interface TOCHeader {
  id: number
  level: number
  text: string
  link: string
}

interface Props {
  list: TOCHeader[]
}

const GuidesTableOfContents: FC<Props> = ({ list }) => {
  return (
    <ul className="toc-menu list-none pl-4 text-[0.8rem] grid gap-2 mt-12">
      {list.map((item, i) => (
        <li key={`${item.level}-${i}`} className={item.level === 3 ? 'ml-4' : ''}>
          <a
            href={`#${formatSlug(item.link)}`}
            className="text-scale-1000 hover:text-brand-900 transition-colors"
            dangerouslySetInnerHTML={{ __html: formatTOCHeader(removeAnchor(item.text)) }}
          />
        </li>
      ))}
    </ul>

    // <ul className="toc-menu list-none pl-4 text-[0.8rem] grid gap-2 mt-12">
    //   {(toc.json as TOCHeader[])
    //     .filter((item) => item.lvl !== 1 && item.lvl <= 3)
    //     .map((item: any, i: number) => {
    //       return (
    //         <li key={i} id={item.lvl} style={{ marginLeft: `${(item.lvl - 2) * 1}rem` }}>
    //           <a
    //             href={`#${formatSlug(item.slug)}`}
    //             className="text-scale-1000 hover:text-brand-900 transition-colors"
    //             dangerouslySetInnerHTML={{ __html: formatTOCHeader(removeAnchor(item.content)) }}
    //           />
    //         </li>
    //       )
    //     })}
    // </ul>
  )
}

export default GuidesTableOfContents

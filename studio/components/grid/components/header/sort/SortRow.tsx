import update from 'immutability-helper'
import { FC, useRef, memo } from 'react'
import { Button, IconMenu, Toggle, IconX } from 'ui'
import { XYCoord } from 'dnd-core'
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd'

import { useUrlState } from 'hooks'
import { DragItem, Sort } from 'components/grid/types'
import { useTrackedState } from 'components/grid/store'

type SortRowProps = {
  index: number
  columnName: string
  sort: Sort
}

const SortRow: FC<SortRowProps> = ({ index, columnName, sort }) => {
  const state = useTrackedState()
  const [_, setParams] = useUrlState({ arrayKeys: ['sort'] })

  const column = state?.table?.columns.find((x) => x.name === columnName)
  if (!column) return null

  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: 'sort-row',
    item: () => {
      return { key: columnName, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ handlerId }, drop] = useDrop({
    accept: 'sort-row',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      moveSort(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  function onToggle(value: boolean) {
    setParams((prevParams) => {
      const existingSorts = (prevParams?.sort ?? []) as string[]
      const updatedSorts = existingSorts.map((sort: string) => {
        const [column] = sort.split(':')
        return column === columnName ? `${columnName}:${value ? 'asc' : 'desc'}` : sort
      })
      return {
        ...prevParams,
        sort: updatedSorts,
      }
    })
  }

  function onRemoveSort() {
    setParams((prevParams) => {
      const existingSorts = (prevParams?.sort ?? []) as string[]
      const updatedSorts = existingSorts.filter((sort: string) => {
        const [column] = sort.split(':')
        if (column !== columnName) return sort
      })
      return {
        ...prevParams,
        sort: updatedSorts,
      }
    })
  }

  const moveSort = (dragIndex: number, hoverIndex: number) => {
    if (dragIndex == hoverIndex) return
    setParams((prevParams) => {
      const existingSorts = (prevParams?.sort ?? []) as string[]
      const updatedSorts = update(existingSorts, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, existingSorts[dragIndex]],
        ],
      })
      return {
        ...prevParams,
        sort: updatedSorts,
      }
    })
  }

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))

  return (
    <div
      className="flex items-center gap-3 px-3"
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      <Button
        icon={<IconX strokeWidth={1.5} size={14} />}
        size="tiny"
        type="text"
        onClick={onRemoveSort}
      />
      <div className="grow">
        <span className="flex grow items-center gap-1 truncate text-sm text-scale-1200">
          <span className="text-xs text-scale-900">{index > 0 ? '然后通过' : '通过'}</span>
          {column.name}
          <span className="text-xs text-scale-900">排序</span>
        </span>
      </div>
      <div className="flex items-center gap-1">
        <label className="text-xs text-scale-900">上升:</label>
        <Toggle
          size="tiny"
          layout="flex"
          defaultChecked={sort.ascending}
          // @ts-ignore
          onChange={(e: boolean) => onToggle(e)}
        />
      </div>
      <span className="transition-color text-scale-900 hover:text-scale-1100">
        <IconMenu strokeWidth={2} size={16} />
      </span>
    </div>
  )
}
export default memo(SortRow)

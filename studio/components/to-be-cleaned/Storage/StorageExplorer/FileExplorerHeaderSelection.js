import { Button, IconDownload, IconTrash2, IconMove, IconX } from 'ui'

const FileExplorerHeaderSelection = ({
  selectedItems = [],
  onSelectItemsDownload = () => {},
  onSelectItemsDelete = () => {},
  onSelectItemsMove = () => {},
  onUnselectAllItems = () => {},
}) => {
  return (
    <div className="z-10 flex h-[40px] items-center rounded-t-md bg-brand-700 px-2 py-1 shadow dark:bg-brand-600">
      <Button
        icon={<IconX size={16} strokeWidth={2} />}
        type="text"
        shadow={false}
        onClick={onUnselectAllItems}
      />
      <div className="ml-4 flex items-center space-x-3">
        <p className="mb-0 text-sm text-scale-1200">
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{selectedItems.length}</span>个对象被选中
        </p>
        {/* [Joshen] Disabled multi download for now */}
        <Button
          icon={<IconDownload size={16} strokeWidth={2} />}
          type="primary"
          shadow={false}
          onClick={onSelectItemsDownload}
        >
          下载
        </Button>
        <div className="border-r border-green-800 py-3 opacity-50" />
        <Button
          icon={<IconTrash2 size={16} strokeWidth={2} />}
          type="primary"
          shadow={false}
          onClick={onSelectItemsDelete}
        >
          删除
        </Button>
        <Button
          icon={<IconMove size={16} strokeWidth={2} />}
          type="primary"
          shadow={false}
          onClick={onSelectItemsMove}
        >
          移动
        </Button>
      </div>
    </div>
  )
}

export default FileExplorerHeaderSelection

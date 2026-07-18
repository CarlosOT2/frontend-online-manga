//# Classes //
import './previewline.scss'

type PreviewLineProps = {
    width?: string,
    height?: number | string,
    marginTop?: number | string
}
export default function PreviewLine({ width = '100%', height = 16, marginTop = "none" }: PreviewLineProps) {
    return (
        <div className="previewline" style={{ width, height, marginTop }} />
    )
}
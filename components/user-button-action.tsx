"use client"

interface SettingsButtonProps {
    children?: React.ReactNode
    action: () => void
}

export const UserButtonAction = ({children, action}: SettingsButtonProps) => {
    return (
        <div onClick={action} className="cursor-pointer">
            {children}
        </div>
    )
}
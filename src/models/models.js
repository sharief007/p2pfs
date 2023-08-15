const TaskStatus =  {
    PENDING : 'PENDING',
    ACTIVE : 'RUNNING',
    INACTIVE: 'INACTIVE',
    REJECTED : 'REJECTED',
    COMPLETED : 'COMPLETED',
    CANCELLED : 'CANCELLED',
    FAILED : 'FAILED'
}

const MessageType = {
    FILE_REQUEST : 'FILE_REQUEST',
    FILE_RESPONSE : 'FILE_RESPONSE'
}

export {
    TaskStatus,
    MessageType
}
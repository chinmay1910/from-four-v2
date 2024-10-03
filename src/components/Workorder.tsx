// Example.tsx

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { DndProvider, useDrop, useDrag } from 'react-dnd'; // Correct imports
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Menu, Transition } from '@headlessui/react';
import { Label } from '../common/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../common/Select';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../common/Dialog';
import { UserIcon, FolderOpenIcon, EyeIcon, ArchiveBoxIcon, AdjustmentsHorizontalIcon, FlagIcon } from '@heroicons/react/24/outline';
import { Drawer, DrawerBody, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "../common/Drawer";
import { TriangleAlert, CircleDot, CircleDashed, Ban, User, ChevronRight, SquareArrowOutUpRight, Pencil } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';
import WOForm from './WOForm';
import { TextInput } from '@tremor/react';
import { Tab } from "@tremor/react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  workType: string;
  priority?: string;
  assignee?: string;
  dueDate?: {
    start: string;
    end: string;
  };
  workOrderNumber?: string;
}

type StateType = [boolean, () => void, () => void, () => void] & {
  state: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const useToggleState = (initial = false): StateType => {
  const [state, setState] = React.useState<boolean>(initial)

  const close = () => {
    setState(false)
  }

  const open = () => {
    setState(true)
  }

  const toggle = () => {
    setState((state) => !state)
  }

  const hookData = [state, open, close, toggle] as StateType
  hookData.state = state
  hookData.open = open
  hookData.close = close
  hookData.toggle = toggle
  return hookData
}

const optionsSelect = [
  {
    value: "dress-shirt-striped",
    label: "Striped Dress Shirt",
  },
  {
    value: "relaxed-button-down",
    label: "Relaxed Fit Button Down",
  },
  {
    value: "slim-button-down",
    label: "Slim Fit Button Down",
  },
  {
    value: "dress-shirt-solid",
    label: "Solid Dress Shirt",
  },
  {
    value: "dress-shirt-check",
    label: "Check Dress Shirt",
  },
]


const priority = [
  {
    value: "high",
    label: "High",
    icon: TriangleAlert,
    color: "text-red-500 dark:text-red-400",
    bgColor: "bg-red-200/20 dark:bg-red-400/10",
  },
  {
    value: "medium",
    label: "Medium",
    icon: CircleDot,
    color: "text-yellow-500 dark:text-yellow-400",
    bgColor: "bg-yellow-200/20 dark:bg-yellow-400/10",
  },
  {
    value: "low",
    label: "Low",
    icon: CircleDashed,
    color: "text-green-500 dark:text-green-400",
    bgColor: "bg-green-200/25 dark:bg-green-400/10",
  },
  {
    value: "emergency",
    label: "Emergency",
    icon: Ban,
    color: "text-white",
    bgColor: "bg-rose-600",
  },
];

const workTypes = [
  { value: "preventive", label: "Preventive" },
  { value: "inspection", label: "Inspection" },
  { value: "repair", label: "Repair" },
  { value: "cleaning", label: "Cleaning" },
  { value: "general", label: "General" },
  { value: "emergency", label: "Emergency" },
  { value: "noncritical", label: "Non-Critical" },
];

const status = [
  { value: "open", label: "Open" },
  { value: "accepted", label: "Accepted" },
  { value: "inProgress", label: "In Progress" },
  { value: "onHold", label: "On Hold" },
  { value: "reviewing", label: "Under Review" },
  { value: "archived", label: "Archived" },
];

// Predefined list of users
const users = [
  { value: 'user1', label: 'Mr. Chinmay Awade' },
  { value: 'user2', label: 'Mr. Jayesh Barsole' },
  { value: 'user3', label: 'Mr. Sushil Kulkarni' },
  { value: 'user4', label: 'Mr. Pavan Awade' },
  { value: 'user5', label: 'Mr. Omkar Awade' },
  // Add more users as needed
];

// Function to generate a unique Work Order Number
const generateWorkOrderNumber = () => {
  const timestamp = Date.now();
  return `WO-${timestamp}`;
}

const TaskCard = ({ task, index, moveTask, onDelete, onAssign, onUpdatePriority }) => {
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  }, []);

  const closeMenu = useCallback(() => {
    setShowContextMenu(false);
    setActiveSubmenu(null);
  }, []);

  const handleMouseEnter = (submenu: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setActiveSubmenu(submenu);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveSubmenu(null);
    }, 250);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeMenu]);

  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, index, originalStatus: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const priorityStyle = task.priority
    ? priority.find(p => p.value === task.priority.toLowerCase())
    : priority.find(p => p.value === 'low'); // Default to 'low' if no priority is set

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }} onContextMenu={handleContextMenu}>
      <Card className="flex flex-col gap-3 p-4 w-70 mb-2 relative">
        <div className="flex justify-between items-center gap-5">
          <p className="p-light font-bold text-sm">{status.find(s => s.value === task.status)?.label || task.status}</p>
          <div className='flex gap-2'>
            <span className='whitespace-nowrap text-slate-700 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 rounded-md px-2 py-1 text-xs font-medium'>{workTypes.find(wt => wt.value === task.workType)?.label || task.workType}</span>
            {priorityStyle && (
              <span className={`${priorityStyle.color} ${priorityStyle.bgColor} inline-flex items-center gap-x-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium`}>
                <priorityStyle.icon className="w-3 h-3" />
                {priorityStyle.label}
              </span>
            )}
          </div>
        </div>
        <div className='flex flex-col gap-0.5'>
          <h5 className="font-semibold text-base">{task.title}</h5>
          <p className="p-light text-sm">{task.description}</p>
        </div>
        <div className="flex justify-between items-center gap-5">
          {task.dueDate && (
            <p className="text-xs font-semibold bg-slate-700 text-slate-50 px-2 py-0.5 rounded-md">
              Due: {new Date(task.dueDate.end).toLocaleDateString()}
            </p>
          )}

          <div className='flex items-center gap-3'>
            {task.assignee && (
              <p className='p-muted text-xs flex gap-1 items-center'>
                <User className='w-3 h-3' />
                {users.find(user => user.value === task.assignee)?.label || task.assignee}
              </p>
            )}
            <div>
              <div>
                <div className="flex justify-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="light"><SquareArrowOutUpRight className='w-4 h-4'></SquareArrowOutUpRight></Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle className=''>{task.title}</DialogTitle>
                        <DialogDescription className="mb-1 text-sm leading-6">
                          {task.description}
                          <div className='flex gap-2 my-2'>
                            <span className='whitespace-nowrap text-slate-700 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 rounded-md px-2 py-1 text-xs font-medium'>{workTypes.find(wt => wt.value === task.workType)?.label || task.workType}</span>
                            {priorityStyle && (
                              <span className={`${priorityStyle.color} ${priorityStyle.bgColor} inline-flex items-center gap-x-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium`}>
                                <priorityStyle.icon className="w-3 h-3" />
                                {priorityStyle.label}
                              </span>
                            )}
                          </div>
                          <div className='flex flex-col gap-3'>
                            <div>
                              <Label htmlFor="size">Update Status</Label>

                              <Select>
                                <SelectTrigger id="size" className="mt-2">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  {optionsSelect.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                      {item.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Button variant="primary" >Read Instructions</Button>

                            </div>
                          </div>




                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="mt-6">
                        <DialogClose asChild>
                      
                        </DialogClose>
                        <DialogClose asChild>
                          <Button className="w-full sm:w-fit">Close</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

            </div>
            {task.workOrderNumber && (
              <p className='p-muted text-xs flex gap-1 font-semibold items-center'>
                {task.workOrderNumber}
              </p>
            )}
          </div>
        </div>
      </Card>
      <Transition
        show={showContextMenu}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div
          ref={contextMenuRef}
          style={{
            position: 'fixed',
            top: `${contextMenuPosition.y}px`,
            left: `${contextMenuPosition.x}px`,
            zIndex: 1000,
          }}
          className="relative inline-block text-left"
        >
          <Menu>
            <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-2 py-2">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={` hover:bg-slate-100 ${active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-gray-100'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      onClick={() => {
                        onAssign(task.id);
                        closeMenu();
                      }}
                    >
                      <Pencil className="w-5 h-5 mr-2" aria-hidden="true" />
                      Edit Task
                    </button>

                  )}

                </Menu.Item>
                <hr className='my-1'></hr>
                <div
                  className="relative"
                  onMouseEnter={() => handleMouseEnter('status')}
                  onMouseLeave={handleMouseLeave}
                >
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={` hover:bg-slate-100 mr-2 ${active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-gray-100'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                        Change Status <ChevronRight className='h-6 w-6 pl-2'></ChevronRight>
                      </button>
                    )}
                  </Menu.Item>
                  <Transition
                    show={activeSubmenu === 'status'}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <div className="absolute left-full p-2 top-0 w-56 mt-0 ml-1 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {status.map((s) => (
                        <Menu.Item key={s.value}>
                          {({ active }) => (
                            <button
                              className={` hover:bg-slate-100 mr-2 ${active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-gray-100'
                                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                              onClick={() => {
                                moveTask(task.id, task.status, s.value);
                                closeMenu();
                              }}
                            >
                              {s.label}

                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Transition>
                </div>
                <div
                  className="relative"
                  onMouseEnter={() => handleMouseEnter('priority')}
                  onMouseLeave={handleMouseLeave}
                >
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`hover:bg-slate-100  mr-2 ${active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-gray-100'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        <FlagIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                        Change Priority <ChevronRight className='h-6 w-6 pl-2'></ChevronRight>
                      </button>
                    )}
                  </Menu.Item>
                  <Transition
                    show={activeSubmenu === 'priority'}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <div className="absolute left-full p-2 top-0 w-56 mt-0 ml-1 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {priority.map((p) => (
                        <Menu.Item key={p.value}>
                          {({ active }) => (
                            <button
                              className={`  hover:bg-slate-100 mr-2 ${active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-gray-100'
                                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                              onClick={() => {
                                onUpdatePriority(task.id, p.value);
                                closeMenu();
                              }}
                            >
                              <p.icon className={`w-5 h-5 mr-2 ${p.color}`} aria-hidden="true" />
                              <span className={p.color}>{p.label}</span>
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
          </Menu>
        </div>
      </Transition>
    </div>
  );
};

const Column = ({ columnIndex, tasks, moveTask, title, onDeleteTask, onAssignTask, onUpdatePriority, status }) => {
  const [, drop] = useDrop({
    accept: 'TASK',
    drop: (item: { id: string, index: number, originalStatus: string }, monitor) => {
      if (!monitor.didDrop()) {
        moveTask(item.id, item.originalStatus, status);
      }
    },
  });

  return (
    <Card ref={drop} className="flex flex-col gap-3 bg-gray-100 p-3 rounded min-h-[500px] w-1/4">
      <h4 className="font-bold mb-0 ml-2 mt-2">{title}</h4>
      {tasks.map((task, taskIndex) => (
        <TaskCard
          key={task.id}
          task={task}
          index={taskIndex}
          moveTask={moveTask}
          onDelete={onDeleteTask}
          onAssign={onAssignTask}
          onUpdatePriority={onUpdatePriority}
        />
      ))}
    </Card>
  );
};

const Workorder = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editOpen, setEditOpen] = useState(false); // Change this line
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const moveTask = useCallback((taskId: string, fromStatus: string, toStatus: string) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? { ...task, status: toStatus } : task
      );
      return updatedTasks;
    });
  }, []);

  const addNewTask = useCallback((newTask: Task) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  }, []);

  const assignTask = useCallback((taskId: string) => {
    setEditingTask(tasks.find(task => task.id === taskId) || null);
    setEditOpen(true);
  }, [tasks, setEditOpen]);

  const handleFormSubmit = useCallback((formData: Task) => {
    if (editingTask) {
      setTasks(prevTasks => prevTasks.map(task =>
        task.id === editingTask.id ? { ...task, ...formData } : task
      ));
    } else {
      addNewTask({
        id: Date.now().toString(),
        status: status[0].value,
        workOrderNumber: generateWorkOrderNumber(),
        ...formData,
      });
    }
    setEditOpen(false); // Change this line
    setEditingTask(null);
  }, [editingTask, addNewTask]);

  const showEdit = () => {
    setEditingTask(null);
    setEditOpen(true); // Change this line
  };

  const closeEdit = () => setEditOpen(false); // Change this line

  const updatePriority = useCallback((taskId: string, newPriority: string) => {
    setTasks(prevTasks => prevTasks.map(task =>
      task.id === taskId ? { ...task, priority: newPriority } : task
    ));
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Work Orders</h2>
          <Button onClick={showEdit}>Assign Work</Button>
        </div>
        <Tabs defaultValue="active">
          <TabsList className="mb-2" variant='solid'>
            <TabsTrigger className='text-base  px-3 py-1' value="active">Active</TabsTrigger>
            <TabsTrigger className='text-base  px-3 py-1' value="onhold">Under Review</TabsTrigger>
            <TabsTrigger className='text-base  px-3 py-1' value="archived">Archived</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <div className="flex gap-4">
              {['open', 'accepted', 'inProgress', 'onHold'].map((statusValue, index) => {
                const statusOption = status.find(s => s.value === statusValue);
                return (
                  <Column
                    key={statusValue}
                    columnIndex={index}
                    tasks={tasks.filter(task => task.status === statusValue)}
                    moveTask={moveTask}
                    title={statusOption?.label || ''}
                    onDeleteTask={deleteTask}
                    onAssignTask={assignTask}
                    onUpdatePriority={updatePriority}
                    status={statusValue}
                  />
                );
              })}
            </div>
          </TabsContent>
          <TabsContent value="onhold">
            <div className="flex gap-4">
              {['reviewing'].map((statusValue, index) => {
                const statusOption = status.find(s => s.value === statusValue);
                return (
                  <Column
                    key={statusValue}
                    columnIndex={index}
                    tasks={tasks.filter(task => task.status === statusValue)}
                    moveTask={moveTask}
                    title={statusOption?.label || ''}
                    onDeleteTask={deleteTask}
                    onAssignTask={assignTask}
                    onUpdatePriority={updatePriority}
                    status={statusValue}
                  />
                );
              })}
            </div>
          </TabsContent>
          <TabsContent value="archived">
            <div className="flex gap-4">
              <Column
                key="archived"
                columnIndex={0}
                tasks={tasks.filter(task => task.status === 'archived')}
                moveTask={moveTask}
                title="Archived"
                onDeleteTask={deleteTask}
                onAssignTask={assignTask}
                onUpdatePriority={updatePriority}
                status="archived"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center">
          <Drawer
            open={editOpen} // Change this line
            onOpenChange={setEditOpen} // Change this line
          >
            <DrawerContent className="sm:max-w-2xl">
              <DrawerHeader>
                <DrawerTitle>{editingTask ? 'Edit Work Order' : 'Assign New Work Order'}</DrawerTitle>
                <DrawerDescription className="mt-1 text-sm">
                  {editingTask ? 'Edit the details of the work order' : 'Fill in the details for the new work order'}
                </DrawerDescription>
              </DrawerHeader>
              <DrawerBody>
                <div className="sm:mx-auto sm:max-w-2xl">
                  <WOForm
                    initialData={editingTask || undefined}
                    onSubmit={handleFormSubmit}
                    workTypes={workTypes}
                    priorities={priority}
                    users={users} // Pass users to WOForm
                  />
                </div>
              </DrawerBody>
              <DrawerFooter className="mt-6">
                <div className="flex items-center justify-end space-x-4">
                  <Button variant="secondary" onClick={closeEdit}>
                    Cancel
                  </Button>
                </div>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </DndProvider>
  );
};

export default Workorder;

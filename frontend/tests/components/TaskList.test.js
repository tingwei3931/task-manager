import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import TaskList from '../../src/components/TaskList';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));


describe('TaskList', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const onMarkAsDone = jest.fn();

    beforeEach(() => { 
        onEdit.mockClear();
        onDelete.mockClear();
        onMarkAsDone.mockClear();
    })
    test('renders no tasks message when task list is empty', () => {
        render(<TaskList tasks={[]} />);
        expect(screen.getByText(/No tasks available/i)).toBeInTheDocument();
    });

    test('renders a list of tasks', () => {
        const tasks = [
            { id: 1, title: 'Task 1', description: 'Task 1 description' },
            { id: 2, title: 'Task 2', description: 'Task 2 description' },
        ];

        render(<TaskList tasks={tasks} />);
        expect(screen.getByText(/Task 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Task 2/i)).toBeInTheDocument();
    });

    test('renders correctly with no tasks prop', () => {
        render(<TaskList />);
        expect(screen.getByText(/No tasks available/i)).toBeInTheDocument();
    });

    test('renders ListItemText components for each task', () => {
        const tasks = [
            { id: 1, title: 'Task 1' },
            { id: 2, title: 'Task 2' },
        ];

        render(<TaskList tasks={tasks} />);
        const listItemTexts = screen.getAllByRole('listitem');
        expect(listItemTexts).toHaveLength(tasks.length);
        tasks.forEach(task => {
            expect(screen.getByText(task.title)).toBeInTheDocument();
        });
    });

    test('calls onEdit when edit button is clicked', () => {
        const tasks = [{ id: 1, title: 'Task 1' }];
        render(<TaskList tasks={tasks} onEdit={onEdit} />);

        fireEvent.click(screen.getByRole('button', { name: /edit/i }));
        expect(onEdit).toHaveBeenCalledWith(1);
    });

    test('calls onDelete when delete button is clicked', () => {
        const tasks = [{ id: 1, title: 'Task 1' }];
        render(<TaskList tasks={tasks} onDelete={onDelete} />);

        fireEvent.click(screen.getByRole('button', { name: /delete/i }));
        expect(onDelete).toHaveBeenCalledWith(1);
    });

    test('calls onMarkAsDone when mark as done button is clicked', () => {
        const tasks = [{ id: 1, title: 'Task 1' }];
        render(<TaskList tasks={tasks} onMarkAsDone={onMarkAsDone} />);

        fireEvent.click(screen.getByRole('button', { name: /check/i }));
        expect(onMarkAsDone).toHaveBeenCalledWith(1);
    });
});
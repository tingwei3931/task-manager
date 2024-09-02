import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { createTask } from '../../src/api';
import TaskForm from '../../src/components/TaskForm';

// Mock the createTask API function
jest.mock('../../src/api', () => ({
    createTask: jest.fn(),
}));

describe('TaskForm', () => {
    const onTaskCreated = jest.fn();
    const showError = jest.fn();

    beforeEach(() => {
        onTaskCreated.mockClear();
        showError.mockClear();
        createTask.mockClear();
    });

    test('renders TaskForm component', () => {
        render(<TaskForm onTaskCreated={onTaskCreated} showError={showError} />);
        expect(screen.getByLabelText(/Task Title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Task Description/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Add Task/i })).toBeInTheDocument();
    });

    test('submits the form successfully', async () => {
        createTask.mockResolvedValueOnce({
            status: 201,
            data: { id: 1, title: 'Test Task', description: 'Test Description' },
        });

        render(<TaskForm onTaskCreated={onTaskCreated} showError={showError} />);

        fireEvent.change(screen.getByLabelText(/Task Title/i), { target: { value: 'Test Task' } });
        fireEvent.change(screen.getByLabelText(/Task Description/i), { target: { value: 'Test Description' } });
        fireEvent.click(screen.getByRole('button', { name: /Add Task/i }));

        expect(createTask).toHaveBeenCalledWith({ title: 'Test Task', description: 'Test Description' });
        // Find all elements with the text "Add Task"
        const allElements = await screen.findAllByText(/Add Task/i);

        // Filter out elements that are buttons
        const nonButtonElements = allElements.filter(element => element.getAttribute('role') !== 'button');
        
        // Verify that the non-button elements contain the expected text
        expect(nonButtonElements.length).toBeGreaterThan(0);
        nonButtonElements.forEach(element => {
            expect(element).toHaveTextContent(/Add Task/i);
        });
        
        await waitFor(() => {
            expect(onTaskCreated).toHaveBeenCalledTimes(1);
        })
        expect(onTaskCreated).toHaveBeenCalledWith({ id: 1, title: 'Test Task', description: 'Test Description' });
    });

    test('shows error on form submission failure', async () => {
        // Mock API error
        createTask.mockRejectedValueOnce(new Error('API Error'));

        render(<TaskForm onTaskCreated={onTaskCreated} showError={showError} />);

        fireEvent.change(screen.getByLabelText(/Task Title/i), { target: { value: 'Test Task' } });
        fireEvent.change(screen.getByLabelText(/Task Description/i), { target: { value: 'Test Description' } });
        fireEvent.click(screen.getByRole('button', { name: /Add Task/i }));

        expect(createTask).toHaveBeenCalledWith({ title: 'Test Task', description: 'Test Description' });
        // Find all elements with the text "Add Task"
        const allElements = await screen.findAllByText(/Add Task/i);

        // Filter out elements that are buttons
        const nonButtonElements = allElements.filter(element => element.getAttribute('role') !== 'button');
        
        // Verify that the non-button elements contain the expected text
        expect(nonButtonElements.length).toBeGreaterThan(0);
        nonButtonElements.forEach(element => {
            expect(element).toHaveTextContent(/Add Task/i);
        });

        await waitFor(() => {
            expect(showError).toHaveBeenCalledTimes(1);
        });
        expect(showError).toHaveBeenCalledWith('Error creating task', expect.any(Error));
    });
});
import { Request, Response } from 'express';
import { firebaseConfig } from '../config/firebase';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc, addDoc, updateDoc } from "firebase/firestore";

export class TasksController {
    deleteById = async (req: Request, res: Response) => {
        const id = req.params.id;

        try {
            const db = getFirestore(firebaseConfig);
            const tasksRef = collection(db, 'tasks');

            const q = query(tasksRef, where("id", "==", id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const taskDoc = querySnapshot.docs[0];
                const taskRef = doc(db, 'tasks', taskDoc.id);

                await deleteDoc(taskRef);
                res.json({ message: 'Task deleted successfully from the database!' });
            } else {
                res.status(404).json({ error: 'No matching document found for the provided ID.' });
            }
        } catch (error) {
            console.error('Error deleting task from the database:', error);
            res.status(500).json({ error: 'An error occurred while deleting the task.' });
        }
    };

    saveTask = async (req: Request, res: Response) => {
        const task = req.body;

        try {
            const db = getFirestore(firebaseConfig);
            const tasksCollectionRef = collection(db, "tasks");
            console.log("Task being added:", task);
            await addDoc(tasksCollectionRef, task);
            res.json({ message: 'Task saved successfully!' });
        } catch (error) {
            console.error('Error saving task:', error);
            res.status(500).json({ error: 'An error occurred while saving the task.' });
        }
    };

    fetchTasks = async (req: Request, res: Response) => {
        const userUid = req.query.userUid;
        console.log(userUid)

        try {
            const db = getFirestore(firebaseConfig);

            const q = query(
                collection(db, 'tasks'),
                where('uid', '==', userUid)
            );

            const querySnapshot = await getDocs(q);

            const tasks: any = [];
            querySnapshot.forEach((doc) => {
                const taskData = doc.data();
                tasks.push(taskData);
            });

            res.json(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            res.status(500).json({ error: 'An error occurred while fetching tasks.' });
        }
    }

    updateTasks = async (req: Request, res: Response) => {
        const { id, content } = req.body

        try {
            const db = getFirestore(firebaseConfig);

            const tasksRef = collection(db, "tasks");
            const q = query(tasksRef, where("id", "==", id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const taskDoc = querySnapshot.docs[0];
                const taskRef = doc(db, "tasks", taskDoc.id);

                await updateDoc(taskRef, { content: content });
                res.json({ message: 'Task updated successfully!' })
            } else {
                console.log("No matching document found for the provided ID.");
            }
        } catch (error) {
            console.error("Error updating task:", error);
        }
    }

    updateStatus = async (req: Request, res: Response) => {
        const { id, newCompletedStatus } = req.body

        try {
            const db = getFirestore(firebaseConfig);
            
            const tasksRef = collection(db, "tasks");
            const q = query(tasksRef, where("id", "==", id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const taskDoc = querySnapshot.docs[0];
                const taskRef = doc(db, "tasks", taskDoc.id);

                await updateDoc(taskRef, { completed: newCompletedStatus });
                res.json({ message: "Task completed status updated successfully!"});
            } else {
                res.json({ message: "No matching document found for the provided ID."});
            }
        } catch (error) {
            console.error("Error updating task completed status:", error);
        }
    }
}


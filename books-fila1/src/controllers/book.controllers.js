import Book from '../models/book.model.js';

const validationError = (res, message) => {
return res.status(400).json({ error: message });
};

export const getAllBooks = async (req, res) => {
try {
    const books = await Book.findAll();
    res.json(books);
} catch (error) {
    res.status(500).json({ error: 'Error al obtener los libros' });
}
};

export const getBookById = async (req, res) => {
try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
    return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.json(book);
} catch (error) {
    res.status(500).json({ error: error.message });
}
};

export const createBook = async (req, res) => {
try {
    const { title, author, pages, genre, description } = req.body;

    // Validaciones básicas
    if (!title || !author || !pages || !genre) {
    return validationError(res, 'Todos los campos obligatorios deben ser proporcionados');
    }

    if (isNaN(pages)){
    return validationError(res, 'Las páginas deben ser un número');
    }

    const newBook = await Book.create({
    title,
    author,
    pages,
    genre,
    description
    });

    res.status(201).json(newBook);
} catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
    return validationError(res, 'Ya existe un libro con este título');
    }
    res.status(500).json({ error: 'Error al crear el libro' });
}
};

export const updateBook = async (req, res) => {
try {
    const { id } = req.params;
    const { title, author, pages, genre, description } = req.body;

    const book = await Book.findByPk(id);
    if (!book) {
    return res.status(404).json({ error: 'Libro no encontrado' });
    }

    // Validar unicidad del título si cambió
    if (title && title !== book.title) {
    const existingBook = await Book.findOne({ where: { title } });
    if (existingBook) {
        return validationError(res, 'Ya existe un libro con este título');
    }
    }

    await book.update({
    title: title || book.title,
    author: author || book.author,
    pages: pages || book.pages,
    genre: genre || book.genre,
    description: description !== undefined ? description : book.description
    });

    res.json(book);
} catch (error) {
    res.status(500).json({ error: 'Error al actualizar el libro' });
}
};

export const deleteBook = async (req, res) => {
try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    
    if (!book) {
    return res.status(404).json({ error: 'Libro no encontrado' });
    }

    await book.destroy();
    res.status(204).send();
} catch (error) {
    res.status(500).json({ error: 'Error al eliminar el libro' });
}
};
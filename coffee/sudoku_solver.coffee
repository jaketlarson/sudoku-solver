class window.SudokuSolver
  constructor: ->
    @initEnv()
    @buildPuzzleInterface()
    @initListeners()
    @updateSize()

  initEnv: =>
    @solver_path = "http://sudoku-solver-mdl.herokuapp.com/solver/call_solver.php"
    @$puzzle_interface = $('#puzzle-interface')
    @$sudoku_submit_form = $('form#sudoku-submit')
    @rows = 9
    @cols = 9

  buildPuzzleInterface: =>
    for i in [1..@rows]
      console.log i
      $row = $('<div />').attr('class', 'puzzle-row')
      for i in [1..@cols]
        $row.append "<input type='text' maxlength='1'>"

      @$puzzle_interface.append $row

  initListeners: =>
    @$puzzle_interface.find('input').keyup (e) =>
      $elem = $(e.currentTarget)
      val = parseInt $elem.val()

      if val >= 1 && val <= 9
        index = @$puzzle_interface.find('input').index $elem
        if index != @$puzzle_interface.find('input').length - 1
          @$puzzle_interface.find('input')[index+1].focus()

    $(window).resize =>
      @updateSize()

    @$sudoku_submit_form.submit (e) =>
      e.preventDefault()
      @submitPuzzle()

  updateSize: =>
    width = @$puzzle_interface.find('input').width()
    @$puzzle_interface.find('input').height(width)
    console.log width

  submitPuzzle: =>
    sequence = []
    $.each @$puzzle_interface.find('input'), (index, elem) =>
      value = parseInt($(elem).val())
      if value >= 1 && value <= 9
        sequence.push value
      else
        sequence.push 0

    console.log sequence.length
    
    $.ajax(
      type: 'GET'
      url: "#{@solver_path}?puzzle=#{sequence.join(' ')}"
      success: (data) =>
        if data == "invalid"
          @handleInvalid()
        else
          @handleSuccess data

      error: =>
        console.log 'darn'
    )

  handleInvalid: =>
    console.log 'invalid'

  handleSuccess: (data) =>
    entries = data.split(' ')
    $.each entries, (index, entry) =>
      @$puzzle_interface.find('input')[index].val entry


$ ->
  solver = new window.SudokuSolver